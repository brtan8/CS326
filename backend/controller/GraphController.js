import GraphModel from "../model/GraphFactory.js";
 import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
 import fs from 'fs/promises';
 import path from 'path';

 const tempDir = path.join(__dirname, '../../temp');

 fs.mkdir(tempDir, { recursive: true }).catch(console.error);

 // New object to store filenames based on chart and options
 const generatedFiles = {};

 class GraphController {
    constructor() {
        this.model = GraphModel.getModel();
    }

    async getAllExpenses(request, result) {
        try {
            const expenses = await this.model.read();
            result.json(expenses);
        } 
        catch (error) {
            console.error("Error getting all expenses:", error);
            result.status(500).json({ error: "Failed to retrieve expenses" });
        }
    }

    async exportChart(request, result) {
        try {
            const chartData = request.body.chartData;
            const exportOptions = request.body.options;
            const width = parseInt(exportOptions.width, 10) || 800;
            const height = parseInt(exportOptions.height, 10) || 600;
            const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });

            const chartKey = this.generateChartKey(chartData.type, exportOptions);

            const fileName = `chart-${chartKey}.png`;
            const filePath = path.join(tempDir, fileName);

            const fileBuffer = await chartJSNodeCanvas.renderToBuffer(chartData, 'image/png');

            if (generatedFiles[chartKey]) {
                try {
                    await fs.unlink(path.join(tempDir, generatedFiles[chartKey]));
                } 
                catch (deleteError) {
                    console.error('Error deleting old file:', deleteError);
                }
            }

            await fs.writeFile(filePath, fileBuffer);
            generatedFiles[chartKey] = fileName;
            const downloadUrl = `/download/${fileName}`;
            result.json({ success: true, downloadUrl });

        } 
        catch (error) {
            console.error('Error exporting chart:', error);
            result.status(500).json({ success: false, error: 'Failed to export chart' });
        }
    }

    async downloadFile(request, result) {
        const filename = request.params.filename;
        const filePath = path.join(tempDir, filename);
        result.download(filePath, (err) => {
        if (err) {
            console.error('Error downloading file:', err);
            result.status(404).send('File not found');
        }
        });
    }

    generateChartKey(chartType, options) {
        let key = `${chartType}-${options.days || 'all'}`;

        // We only include width and height if you deem them essential for "uniqueness"
        // If charts of the same type/range are visually the same regardless of size, omit them
        /*
        if (options.width) {
            key += `-${options.width}`;
        }
        if (options.height) {
            key += `-${options.height}`;
        }
        */
        return key;
    }
}

 export default new GraphController();