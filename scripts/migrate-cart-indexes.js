/*
 * One-off migration. RUN THIS BEFORE DEPLOYING the cart index change.
 *
 * cart.model.ts and cartItem.model.ts now declare unique indexes:
 *   carts     { UserId: 1 }                unique
 *   cartitems { CartId: 1, ProductId: 1 }  unique
 *
 * Neither constraint has ever been enforced, and `findOneAndUpdate(..., { upsert: true })`
 * ran for the lifetime of the app with no unique index behind it, so violating rows
 * may already exist. Building a unique index over dirty data fails, and the API now
 * refuses to start when the index build fails (by design — the alternative is running
 * silently unindexed). This script collapses the duplicates first.
 *
 * Usage:  mongosh "<your MONGODB_URI>" scripts/migrate-cart-indexes.js
 */

// 1. Collapse duplicate carts per user, re-pointing their items at the survivor.
let dupCarts = 0
db.carts
  .aggregate([
    { $group: { _id: '$UserId', ids: { $push: '$_id' }, n: { $sum: 1 } } },
    { $match: { n: { $gt: 1 } } },
  ])
  .forEach((g) => {
    const keep = g.ids[0]
    const drop = g.ids.slice(1)
    db.cartitems.updateMany({ CartId: { $in: drop } }, { $set: { CartId: keep } })
    db.carts.deleteMany({ _id: { $in: drop } })
    dupCarts += drop.length
  })
print(`carts: removed ${dupCarts} duplicate cart(s)`)

// 2. Remove carts with a null/missing UserId — a unique index permits only one.
const orphaned = db.carts.deleteMany({ UserId: null })
print(`carts: removed ${orphaned.deletedCount} cart(s) with no UserId`)

// 3. Merge duplicate (CartId, ProductId) rows, summing quantities.
//    Must run AFTER step 1, which can itself create duplicates.
let dupItems = 0
db.cartitems
  .aggregate(
    [
      {
        $group: {
          _id: { CartId: '$CartId', ProductId: '$ProductId' },
          ids: { $push: '$_id' },
          total: { $sum: '$Quantity' },
          n: { $sum: 1 },
        },
      },
      { $match: { n: { $gt: 1 } } },
    ],
    { allowDiskUse: true },
  )
  .forEach((g) => {
    const keep = g.ids[0]
    db.cartitems.updateOne({ _id: keep }, { $set: { Quantity: g.total } })
    db.cartitems.deleteMany({ _id: { $in: g.ids.slice(1) } })
    dupItems += g.ids.length - 1
  })
print(`cartitems: merged ${dupItems} duplicate row(s)`)

// 4. Build the indexes.
db.carts.createIndex({ UserId: 1 }, { unique: true })
db.cartitems.createIndex({ CartId: 1, ProductId: 1 }, { unique: true })

printjson(db.carts.getIndexes())
printjson(db.cartitems.getIndexes())
