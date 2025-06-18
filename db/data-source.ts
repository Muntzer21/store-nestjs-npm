
import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';

config({
  path: '.env',
});
export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: ['dist/**/*.entity{.ts,.js}'],
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
