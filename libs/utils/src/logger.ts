// import { Logger, createLogger, format, transports } from 'winston';

// export let log: Logger | null = null;

// const localFormat = format.printf(({ level, message, label, timestamp }) => {
//   return `[${timestamp}] [${level}]  ${message}`;
// });

// const devLogger = () => {
//   return createLogger({
//     level: 'silly',
//     format: format.combine(
//       format.colorize(),
//       format.json(),
//       format.prettyPrint(),
//       format.timestamp({ format: 'HH:mm:ss' }),
//       localFormat,
//     ),
//     defaultMeta: { service: 'user-service' },
//     transports: [new transports.Console()],
//   });
// };

// console.log(process.env['NODE_ENV']);

// if (process.env['NODE_ENV'] === 'local') {
//   log = devLogger();
// }

export class logger {}
