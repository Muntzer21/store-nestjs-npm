
import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { User } from '../src/users/entities/user.entity';
import { Review } from 'src/review/entities/review.entity';
import { Order } from 'src/order/entities/order.entity';
import { Category } from 'src/category/entities/category.entity';
import { Product } from 'src/product/entities/product.entity';
import { OrdersProducts } from 'src/order/entities/orders.producta.entity';
import { Shipping } from 'src/order/entities/shipping.entity';

config({
  path: '.env',
});
export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [User,Review,Order,Category,Product,OrdersProducts,Shipping],
  migrations: ['dist/db/migrations/*{.js,.ts}'],
};
const dataSource = new DataSource(dataSourceOptions);
export default dataSource;

// export const databaseProviders: DynamicModule = TypeOrmModule.forRootAsync({
//   inject: [ConfigService],
//   useFactory: (config: ConfigService) => {
//     return {
//       type: 'postgres',
//       database: config.get<string>('DB_DATABASE'),
//       username: config.get<string>('DB_USERNAME'),
//       password: config.get<string>('DB_PASSWORD'),
//       port: config.get<number>('DB_PORT'),
//       host: 'localhost',
//       synchronize: true, //only in development envirment
//         entities: ['dist/**/*.entity{.ts,.js}'],
//       migrations:['dist/db/migrations/*{.js,.ts}']
//     };
//   },
// });
