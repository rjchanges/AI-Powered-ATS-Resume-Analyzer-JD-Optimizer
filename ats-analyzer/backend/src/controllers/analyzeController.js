const analyzeService = require('../services/analyzeService');

exports.analyzeGeneral = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Resume PDF is required.' });
        }

        const result = await analyzeService.processGeneralResume(req.file.path);
        res.json(result);
    } catch (err) {
        console.error('General analyze error:', err);
        res.status(500).json({ error: err.message || 'Internal server error' });
    }
};

exports.analyzeTailored = async (req, res) => {
    try {
        let jobDescription = req.body.jobDescription;
        if (!jobDescription) {
            return res.status(400).json({ error: 'Job description is required.' });
        }

        const { fetchJobDescription } = require('../utils/scraper');
        jobDescription = await fetchJobDescription(jobDescription);

        if (!req.file) {
            return res.status(400).json({ error: 'Resume PDF is required.' });
        }

        const result = await analyzeService.processTailoredResume(
            req.file.path,
            jobDescription
        );
        res.json(result);
    } catch (err) {
        console.error('Tailored analyze error:', err);
        res.status(500).json({ error: err.message || 'Internal server error' });
    }
};

// Map old default behavior to analyzeTailored for now
exports.analyzeResume = exports.analyzeTailored;
