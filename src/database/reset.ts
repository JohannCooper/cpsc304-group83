import { queryDatabase } from '.';

export async function resetDatabase() {
	const tables: any[] = await queryDatabase(`
		SELECT table_name AS name
		FROM information_schema.tables
		WHERE table_schema = 'cpsc_304';
	`);

	const tableNames: string[] = tables.map((table: any) => table.name);

	if (tableNames.length === 0) {
		return;
	}

	await queryDatabase('SET FOREIGN_KEY_CHECKS = 0;');
	for (let i = 0; i < tableNames.length; i++) {
		const name = tableNames[i];
		await queryDatabase(`DROP TABLE IF EXISTS ${name};`);
		console.log(`Deleted table: '${name}'`);
	}
	await queryDatabase('SET FOREIGN_KEY_CHECKS = 1;');
}