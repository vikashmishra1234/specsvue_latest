// lib/mongodb.ts

import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI || ''

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable')
}

let cached = (global as any).mongoose

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null }
}

export async function connectToDatabase() {
  if (cached.conn) {
    console.log('[MongoDB] Already connected.')
    return cached.conn
  }

  if (!cached.promise) {
    console.log('[MongoDB] Connecting to database...')
    cached.promise = mongoose.connect(MONGODB_URI, {
    dbName:"specsvue-database",
    serverSelectionTimeoutMS: 10000 
    })
  }

  try {
    cached.conn = await cached.promise
    console.log('[MongoDB] Successfully connected.')
  } catch (error) {
    // console.error('[MongoDB] Connection error:', error)
    throw error
  }

  return cached.conn
}
