import website from "../assets/images/projects/website.svg";
import pitchly from '../assets/images/pitchly.gif';
import pitchlyForm from '../assets/images/pitchly-form.png';
import nebullam1 from '../assets/images/nebullam-1.png';
import nebullam2 from '../assets/images/nebullam-2.png';
import nebullam3 from '../assets/images/nebullam-3.png';
import nebullam4 from '../assets/images/nebullam-4.png';
import nebullam5 from '../assets/images/nebullam-5.png';
import sudoku from '../assets/images/sudoku.gif';

export default [
	{
		id: 1,
		title: "Connect Four - AI Game",
		icon: website,
		description: "There are 4,531,985,219,092 possible connect-4 boards and you can win in 1,905,333,170,621 ways. That is a probability of 0.42"+
		"\n There are two modes - MINIMAX and NAIVE AI, Feel free to play both and see which you beat.",
		githubPath: "https://github.com/bhimeshchauhan/connect_four",
		media: [],
		demoPath: "https://codesandbox.io/s/connect-four-game-fq1oz?file=/src/App.js",
        iframe: '<iframe '+
            'src="https://codesandbox.io/embed/connect-four-game-fq1oz?fontsize=14&hidenavigation=1&theme=dark&view=preview" '+
            'style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" '+
            'title="Connect-Four-Game" '+
            'allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking" '+
            'sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts allow-autoplay"> '+
            '</iframe>',
		year: "2019-2020",
		techUsed: "React JS, Redux, NodeJS, MinMax Algorithm, Decision tree, Github"
	},
	{
		id: 1,
		title: "Sudoku AR + Deep Learning",
		icon: website,
		description: "A project I worke don to create OpenCV application to read Sudoku from camera and solve it.",
		githubPath: "/#",
		media: [sudoku],
//		demoPath: "/#",
		year: "2019-2020",
		techUsed: "Python, Keras, Scikit-Learn, TensorFlow, OpenCV, backtracking"
	},
	{
		id: 2,
		title: "Procedural Terrain Generation",
		icon: website,
		description: "Procedurally generated wave-esque terrain.",
		githubPath: "/#",
		media: [],
//		demoPath: "/#",
        iframe: '<iframe width="100%" height="300" src="//jsfiddle.net/bchauhan/vxoa2jzu/5/embedded/result/dark/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe>',
		year: "2020",
		techUsed: "Three.js and WebGL"
	},
	{
		id: 3,
		title: "SpaceFlight - Unity Game",
		icon: website,
		description: "Space Flight game built in Unity.",
		githubPath: "https://github.com/bhimeshchauhan/SpaceExpo",
		media: [],
		demoPath: "https://simmer.io/@bchauhan/spaceshooter",
        iframe: '<iframe src="https://i.simmer.io/@bchauhan/spaceshooter" style="width:960px;height:600px"></iframe>',
		year: "2020",
		techUsed: "Unity, WebGL, OpenGL, C#, Blender"
	},
	{
		id: 4,
		title: "Remote Monitoring - Aeroponics System",
		icon: website,
		description: "Monitoring the remote arduino systems.",
		media: [nebullam1, nebullam2, nebullam3, nebullam4, nebullam5],
//		githubPath: "/#",
		demoPath: "https://apkpure.com/nebullam/com.nebullam.nebullam",
		year: "2016-2017",
		techUsed: "Python, WAMP, Django, Android SDK, D3.js, TensorFlow, ArgoUML, "
	},
	{
		id: 5,
		title: "Forms App",
		icon: website,
//		githubPath: "https://pitchly.com/",
		description: "A customizable form application.",
		media: [pitchly, pitchlyForm],
		demoPath: "https://pitchly.com/",
		year: "2018-2019",
		techUsed: "MeteorJS, RESTful, NodeJS, MongoDB, AWS, GraphQL, Apollo, Nginx."
	}

];
