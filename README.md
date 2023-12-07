build application:
    npx tsc

run:
    npm start

Any schema changes - or changes to any *.entity.ts files need to go through a typeorm migration.

first, delete the build/ directory
then compile all of the .ts files
    `npx tsc`

then generate the typeorm migration files.
    `typeorm migration:generate <some_name_for_migration> -d build/database/ormconfig.js`

then re-compile the .ts files
    `npx tsc`

then run the generated migration file (you might need to place the generated .js migration file under the build/migration directory manually)
    `typeorm migration:run -d build/database/ormconfig.js`