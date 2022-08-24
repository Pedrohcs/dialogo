const movementRepository = require('../repositories/movement')

module.exports.totalMovements = async function() {
    try {
        let limit = 5
        let offset = 0

        let countMovements = await movementRepository.count()
        countMovements = countMovements && countMovements[0] && countMovements[0].count ? parseInt(countMovements[0].count) : 0

        let totalMovements = []

        while (offset < countMovements) {
            let movements = await movementRepository.getContainersInMovements(limit, offset)
            totalMovements = totalMovements.concat(movements)
            offset += limit
        }

        return formatReport(totalMovements)
    } catch(error) {
        console.error(`[reportTotalMovements] Error generating report of all movements. ${error.message}`)
        throw error
    }
}

function formatReport(movements) {
    let report = {
        totalImports: 0,
        totalExports: 0
    }

    for (let movement of movements) {
        if (!report[`${movement.client}`])
            report[`${movement.client}`] = {
                imports: 0,
                exports: 0
            }
        if (!report[`${movement.client}`][`${movement.type}`])
            report[`${movement.client}`][`${movement.type}`] = []

        report[`${movement.client}`][`${movement.type}`].push({
            'container': movement.container,
            'startDate': movement['start_date'],
            'endDate': movement['end_date'],
            'category': movement.category === 'Exportacao' ? 'Exportação' : 'Importação',
        })

        if (movement.category === 'Exportacao') {
            report.totalExports += 1
            report[`${movement.client}`].exports += 1
        } else {
            report.totalImports += 1
            report[`${movement.client}`].imports += 1
        }
    }

    return report
}