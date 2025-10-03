import fs from "fs";
import path from "path";

interface MigrationInfo {
    fileName: string;
    className: string;
    filePath: string;
}

function extractClassNameFromFile(filePath: string): string | null {
    try {
        const content = fs.readFileSync(filePath, "utf-8");

        const classMatch = content.match(/export\s+class\s+(\w+)/);
        if (classMatch && content.includes("implements MigrationInterface")) {
            return classMatch[1];
        }
        return null;
    } catch (error) {
        console.error(`Error reading file ${filePath}:`, error);
        return null;
    }
}

function generateMigrationIndex(): void {
    const migrationsDir = path.join(__dirname, "migrations");
    const indexFilePath = path.join(migrationsDir, "index.ts");

    try {
        const files = fs.readdirSync(migrationsDir);

        const migrationFiles = files.filter(file =>
            file.endsWith(".ts") && 
            file !== "index.ts"
        );

        const migrations: MigrationInfo[] = [];

        for (const file of migrationFiles) {
            const filePath = path.join(migrationsDir, file);
            const className = extractClassNameFromFile(filePath);

            if (className) {
                migrations.push({
                    fileName: file,
                    className: className,
                    filePath: `./${file.replace(".ts", "")}`
                });
            } else {
                console.warn(`Skipping file ${file} because it does not contain a valid migration class.`);
            }
        }

        let indexContent = "";

        for (const migration of migrations) {
            indexContent += `export { ${migration.className} } from "${migration.filePath}";\n`;
        }

        fs.writeFileSync(indexFilePath, indexContent, "utf-8");

        console.log(`✅ Successfully generated ${migrations.length} migrations in ${indexFilePath}`);

        migrations.forEach(migration => {
            console.log(`✅ Successfully generated ${migration.className} in ${migration.filePath}`);
        });
    } catch(error) {
        console.error("Error generating migration index:", error);
    }
}

generateMigrationIndex();