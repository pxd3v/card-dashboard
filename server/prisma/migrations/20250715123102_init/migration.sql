-- CreateTable
CREATE TABLE "cards" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "stripeId" TEXT NOT NULL,
    "cardholderId" TEXT NOT NULL,
    "last4" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "operations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "objectType" TEXT NOT NULL,
    "stripeCardId" TEXT NOT NULL,
    "stripeCreatedAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "authorizationId" TEXT,
    "transactionId" TEXT,
    CONSTRAINT "operations_authorizationId_fkey" FOREIGN KEY ("authorizationId") REFERENCES "authorizations" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "operations_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "transactions" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "operations_stripeCardId_fkey" FOREIGN KEY ("stripeCardId") REFERENCES "cards" ("stripeId") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "authorizations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "stripeId" TEXT NOT NULL,
    "stripeCardId" TEXT NOT NULL,
    "amount" BIGINT NOT NULL,
    "approved" BOOLEAN NOT NULL,
    "merchantCategoryStripeId" TEXT NOT NULL,
    "stripeCreatedAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "authorizations_stripeCardId_fkey" FOREIGN KEY ("stripeCardId") REFERENCES "cards" ("stripeId") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "authorizations_merchantCategoryStripeId_fkey" FOREIGN KEY ("merchantCategoryStripeId") REFERENCES "merchant_categories" ("stripeId") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "transactions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "stripeCardId" TEXT NOT NULL,
    "stripeId" TEXT NOT NULL,
    "amount" BIGINT NOT NULL,
    "type" TEXT NOT NULL,
    "merchantCategoryStripeId" TEXT NOT NULL,
    "stripeCreatedAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "transactions_stripeCardId_fkey" FOREIGN KEY ("stripeCardId") REFERENCES "cards" ("stripeId") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "transactions_merchantCategoryStripeId_fkey" FOREIGN KEY ("merchantCategoryStripeId") REFERENCES "merchant_categories" ("stripeId") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "merchant_categories" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "stripeId" TEXT NOT NULL,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "sync_states" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "stripeCardId" TEXT NOT NULL,
    "objectType" TEXT NOT NULL,
    "lastCursor" TEXT,
    "lastSyncAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "sync_states_stripeCardId_fkey" FOREIGN KEY ("stripeCardId") REFERENCES "cards" ("stripeId") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "cards_stripeId_key" ON "cards"("stripeId");

-- CreateIndex
CREATE UNIQUE INDEX "operations_authorizationId_key" ON "operations"("authorizationId");

-- CreateIndex
CREATE UNIQUE INDEX "operations_transactionId_key" ON "operations"("transactionId");

-- CreateIndex
CREATE UNIQUE INDEX "authorizations_stripeId_key" ON "authorizations"("stripeId");

-- CreateIndex
CREATE UNIQUE INDEX "transactions_stripeId_key" ON "transactions"("stripeId");

-- CreateIndex
CREATE UNIQUE INDEX "merchant_categories_stripeId_key" ON "merchant_categories"("stripeId");

-- CreateIndex
CREATE UNIQUE INDEX "sync_states_stripeCardId_objectType_key" ON "sync_states"("stripeCardId", "objectType");
