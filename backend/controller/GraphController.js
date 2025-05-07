import GraphModel from "../model/GraphFactory.js";
 import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
 import fs from 'fs/promises';
 import path from 'path';

 const tempDir = path.join(__dirname, '../../temp');

 fs.mkdir(tempDir, { recursive: true }).catch(console.error);

 //  Now, a simple array to store saved filenames (global limit)
 const savedCharts = [];
 const MAX_SAVED_CHARTS = 5; //  Global limit of 5 saved charts

 class GraphController {
  constructor() {
  this.model = GraphModel.getModel();
  }

  async getAllExpenses(req, res) {
  try {
  const expenses = await this.model.read();
  res.json(expenses);
  } catch (error) {
  console.error("Error getting all expenses:", error);
  res.status(500).json({ error: "Failed to retrieve expenses" });
  }
  }

  async saveChart(req, res) {
  try {
  const chartData = req.body.chartData;
  const exportOptions = req.body.options;
  const width = parseInt(exportOptions.width, 10) || 800;
  const height = parseInt(exportOptions.height, 10) || 600;
  const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });

  const chartKey = this.generateChartKey(chartData.type, exportOptions);
  const fileName = `chart-${chartKey}-${Date.now()}.png`;
  const filePath = path.join(tempDir, fileName);

  const fileBuffer = await chartJSNodeCanvas.renderToBuffer(chartData, 'image/png');
  await fs.writeFile(filePath, fileBuffer);

  //  Manage the savedCharts array (global limit)
  if (savedCharts.length >= MAX_SAVED_CHARTS) {
  const oldestFile = savedCharts.shift(); //  Remove the first (oldest)
  try {
  await fs.unlink(path.join(tempDir, oldestFile)); //  Delete the oldest file
  } catch (deleteError) {
  console.error('Error deleting oldest file:', deleteError);
  }
  }

  savedCharts.push(fileName); //  Add the new file

  const downloadUrl = `/download/${fileName}`;
  res.json({ success: true, downloadUrl, savedFileName: fileName });
  } catch (error) {
  console.error('Error saving chart:', error);
  res.status(500).json({ success: false, error: 'Failed to save chart' });
  }
  }

  async getSavedCharts(req, res) {
  try {
  //  No need for chartKey anymore
  //  const chartKey = req.query.chartKey;
  //  const files = savedCharts[chartKey] || [];
  const downloadUrls = savedCharts.map(file => `/download/${file}`);
  res.json({ success: true, savedCharts: downloadUrls });
  } catch (error) {
  console.error("Error getting saved charts:", error);
  res.status(500).json({ success: false, error: "Failed to get saved charts" });
  }
  }

  async deleteSavedChart(req, res) {
  try {
  const filename = req.params.filename;
  const filePath = path.join(tempDir, filename);

  try {
  await fs.unlink(filePath);
  } catch (deleteError) {
  console.error('Error deleting file:', deleteError);
  return res.status(500).json({ success: false, error: 'Failed to delete file' });
  }

  //  Remove the filename from the savedCharts array
  const index = savedCharts.indexOf(filename);
  if (index > -1) {
  savedCharts.splice(index, 1);
  }

  res.json({ success: true, message: 'File deleted successfully' });
  } catch (error) {
  console.error('Error deleting saved chart:', error);
  res.status(500).json({ success: false, error: 'Failed to delete saved chart' });
  }
  }

  async downloadFile(req, res) {
  const filename = req.params.filename;
  const filePath = path.join(tempDir, filename);
  res.download(filePath, (err) => {
  if (err) {
  console.error('Error downloading file:', err);
  res.status(404).send('File not found');
  }
  });
  }

  generateChartKey(chartType, options) {
  let key = `${chartType}-${options.days || 'all'}`;

  if (options.width) {
  key += `-${options.width}`;
  }
  if (options.height) {
  key += `-${options.height}`;
  }

  return key;
  }
 }

 export default new GraphController();