

// for SERVERLESS Functions/Server actions такое соединение с MongoDB
// cached используется чтобы показать что уже подключены к MongoDB чтобы не делать запрос на подключение 
// к MongoDB каждый раз при выполнении Server actions тк Server actions делают запрос на подключение к MongoDB снова и снова
// те Server actions смотрят в этом коде на cached promise в котором видно подключены к MongoDB или нет
// и если подключены то Server actions не делают снова запрос на подключение чтобы не перенагружать MongoDB запросами на подключение
// те здесь мы создвли cache connection
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

let cached = (global as any).mongoose || { conn: null, promise: null };

export const connectToDatabase = async () => {
  if (cached.conn) return cached.conn;

  if(!MONGODB_URI) throw new Error('MONGODB_URI is missing');

  cached.promise = cached.promise || mongoose.connect(MONGODB_URI, {
    dbName: 'evently',  // название Базы Данных проекта в MongoDB
    bufferCommands: false,
  })

  cached.conn = await cached.promise;

  return cached.conn;
}