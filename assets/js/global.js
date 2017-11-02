import GENERAL from "./pages/general";
import HOME from "./pages/home";
import EXP from "./pages/exp";

let init = null;

switch (global.vars.page) {
	case 'home_page':
		init = HOME.init.bind(HOME);
		break;
    case 'exp_page':
        init = EXP.init.bind(EXP);
        break;
	default:
		init = () => {};
}

// $(window).load(() => {
//     GENERAL.init();
// });

$(document).ready(GENERAL.init(), init());
