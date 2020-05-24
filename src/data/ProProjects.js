import movie from "../assets/images/projects/movie.svg";
import pitchly from '../assets/images/pitchly.gif';
import pitchlyForm from '../assets/images/pitchly-form.png';
import nebullam1 from '../assets/images/nebullam-1.png';
import nebullam2 from '../assets/images/nebullam-2.png';
import nebullam3 from '../assets/images/nebullam-3.png';
import nebullam4 from '../assets/images/nebullam-4.png';
import nebullam5 from '../assets/images/nebullam-5.png';

export default [
	{
		id: 1,
		title: "NLP mood detector",
		icon: movie,
		description: "Type a sentence to detect what mood you are in.",
		githubPath: "/#",
		media: [],
//		demoPath: "/#",
        iframe: '<iframe width="100%" height="300" src="//jsfiddle.net/bchauhan/gcph3uqf/37/embedded/result,js,html,css/dark/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe>',
		year: "",
		techUsed: "Python, NPM, Bower, BeautifulSoup, PIP, Worksheet API"
	},
	{
		id: 1,
		title: "AR Design",
		icon: movie,
		description: "This is a game that you can play developed in js code given here.",
		githubPath: "/#",
		media: [],
//		demoPath: "/#",
        iframe: '<iframe width="100%" height="300" src="//jsfiddle.net/bchauhan/ft4xpvLo/2/embedded/result,js,html,css/dark/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe>',
		year: "",
		techUsed: "Python, NPM, Bower, BeautifulSoup, PIP, Worksheet API"
	},
	{
		id: 2,
		title: "Alexa Skill",
		icon: movie,
		description: " ",
		githubPath: "/#",
		media: [],
//		demoPath: "/#",
        iframe: '<iframe width="100%" height="300" src="//jsfiddle.net/bchauhan/vxoa2jzu/embedded/result,js,html,css/dark/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe>',
		year: "",
		techUsed: "Python, NPM, Bower, BeautifulSoup, PIP, Worksheet API"
	},
	{
		id: 3,
		title: "Package Listing",
		icon: movie,
		description: " ",
		githubPath: "/#",
		media: [],
//		demoPath: "/#",
        iframe: '<iframe width="100%" height="300" src="//jsfiddle.net/bchauhan/ft4xpvLo/embedded/js,html,css,result/dark/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe>',
		year: "",
		techUsed: "Python, NPM, Bower, BeautifulSoup, PIP, Worksheet API"
	},
	{
		id: 4,
		title: "Remote Monitoring - Aeroponics System",
		icon: movie,
		description: "Monitoring the remote arduino systems.",
		media: [nebullam1, nebullam2, nebullam3, nebullam4, nebullam5],
//		githubPath: "/#",
		demoPath: "https://apkpure.com/nebullam/com.nebullam.nebullam",
		year: "2016-2017",
		techUsed: "Python, WAMP, Django, Ember, D3.js, Crossbar.io, ArgoUML"
	},
	{
		id: 5,
		title: "Forms App",
		icon: movie,
//		githubPath: "https://pitchly.com/",
		description: "A customizable form application.",
		media: [pitchly, pitchlyForm],
		demoPath: "https://pitchly.com/",
		year: "2018-2019",
		techUsed: "MeteorJS, RESTful, NodeJS, MongoDB, AWS."
	}

];
