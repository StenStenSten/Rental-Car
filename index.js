const express = require('express');
const bodyParser = require('body-parser');
const rental = require('./rentalPrice');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));
app.use('/pictures', express.static('images'));

const formHtml = fs.readFileSync('form.html', 'utf8');

app.post('/', (req, res) => {
    const post = req.body;
		let resultHtml = fs.readFileSync('result.html', 'utf8');
		const carTypes = ["Compact", "Electric", "Cabrio", "Racer"];

		carTypes.forEach((type) => {
			let result = rental.price(
				Date.parse(post.licensestart),
				Date.parse(post.pickupdate),
				Date.parse(post.dropoffdate),
				String(type),
				Number(post.age)
			);
		resultHtml = resultHtml.replace(`${type}$0`, result);
		})
    
    res.send(formHtml + resultHtml);
});

app.get('/', (req, res) => {
    res.send(formHtml);
});

// Start the server
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
