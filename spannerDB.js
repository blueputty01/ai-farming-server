// Imports the Google Cloud client library
const {Spanner} = require('@google-cloud/spanner');

/**
 * TODO(developer): Uncomment the following lines before running the sample.
 */
 const projectId = 'empowerbot-nywy';
 const instanceId = 'my-instance';
 const databaseId = 'monty-hacks';

// Creates a client
const spanner = new Spanner({
  projectId: projectId,
});

// Gets a reference to a Cloud Spanner instance and database
const instance = spanner.instance(instanceId);
const database = instance.database(databaseId);

database.runTransaction(async (err, transaction) => {
  if (err) {
    console.error(err);
    return;
  }
  try {
    const [rowCount] = await transaction.runUpdate({
      sql: `INSERT itemInfo (farmId, farmName, imgBase64, itemPrice, productDescription) VALUES
      (6097217190, 'Joe'sFarm', 6097217191, 19.99, 'the food is bussin'), 
      (1238281, 'YomamaFarm', 60972171, 9.99, 'the food is kinda bussin')`,
    });
    console.log(`${rowCount} records inserted.`);
    await transaction.commit();
  } catch (err) {
    console.error('ERROR:', err);
  } finally {
    // Close the database when finished.
    database.close();
  }
});

