import fs from 'fs';

let consensus_apys = []
let execution_apys = []
let gross_apys = []

// Function to read the JSON file and analyze the data
const analyzeValidators = () => {
    try {

        // Step 1: Read the JSON file
        const rawData = fs.readFileSync('kilnValidators.json', 'utf-8');
        const validators = JSON.parse(rawData);

        for (let validator of validators) {

            const consensus_rewards =validator.consensus_rewards;  // Example negative value for consensus rewards
            const execution_rewards = validator.execution_rewards;    // Example positive value for execution rewards
            const gross_apy = validator.gross_apy                    // Gross APY value
            const rewards = validator.rewards
    
            console.log(rewards)
            console.log(gross_apy)
            console.log(execution_rewards)
            console.log(consensus_rewards)
            
            // Step 2: Calculate Consensus APY
            const consensus_apy = (consensus_rewards / rewards) * gross_apy;
            
            // Step 3: Calculate Execution APY
            const execution_apy = (execution_rewards / rewards) * gross_apy;

            execution_apys.push(execution_apy)
            consensus_apys.push(consensus_apy)
            gross_apys.push(gross_apy)


            // Log the results
            console.log("Consensus APY: ", consensus_apy + "%");
            console.log("Execution APY: ", execution_apy + "%");

            const results = calculateAverages();
        
            // Write the data to a JSON file
            fs.writeFileSync('kilnResults.json', JSON.stringify(results, null, 2), 'utf-8');
        }

        // Example analysis: Filter validators based on some criteria
    } catch (error) {
        console.error('Error reading or parsing the JSON file:', error);
    }
};

// Call the analysis function
analyzeValidators();

function calculateAverages() {
    let consensusSum = 0;
    let grossSum = 0;
    let executionSum = 0;

    for(let apy of consensus_apys) {
        consensusSum = consensusSum + apy;

    }

    for(let apy of execution_apys) {
        executionSum = executionSum + apy;

    }

    for(let apy of gross_apys) {
        grossSum = grossSum + apy;

    }
    
    let avgConsensusAPY = consensusSum / consensus_apys.length
    let avgExecutionsAPY = executionSum / execution_apys.length
    let avgGrossAPY = grossSum / gross_apys.length


    console.log("Average consensus APY", avgConsensusAPY)
    console.log("Average execution APY", avgExecutionsAPY)
    console.log("Gross APY", avgGrossAPY)

    const results = {
        avgConsensusAPY,
        avgExecutionsAPY,
        avgGrossAPY
    }

    return results;


}