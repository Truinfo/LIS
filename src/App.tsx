import { Redirect, Route, BrowserRouter as Router } from "react-router-dom";
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { hammer, home, business, storefront } from "ionicons/icons";
import Tab1 from "./pages/Tab1";
import Tab2 from "./pages/Tab2";
import Tab3 from "./pages/Tab3"; // Import the SignUp component

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";

import Directory from "./modules/community/Directory";
import Tab4 from "./pages/Tab4";
import Amenities from "./modules/community/NoticeBoard";
import NoticeBoard from "./modules/community/NoticeBoard";
import SocietyBills from "./modules/community/SocietyBills";
import CreateTicket from "./modules/community/CreateTicket";
import GetHelp from "./modules/community/GetHelp";
import Signup from "./modules/auth/Signup";
import DailyHelp from "./modules/services/DailyHelp";
import Maid from "./modules/services/DailyHelp/Maid/Maid";
import MaidsList from "./modules/services/DailyHelp/Maid/MaidList";
import milkManList from "./modules/services/DailyHelp/milk/MilkmanList";
import milkManProfile from "./modules/services/DailyHelp/milk/Milkman";

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        {/* Routes that should not display the bottom navbar */}
        <Route exact path="/signup">
          <Signup />
        </Route>

        {/* Default route can be redirected to either a signup or another page */}
        <Route exact path="/">
          <Redirect to="/tab1" />
        </Route>
      </IonRouterOutlet>

      {/* Tab-based routes that include the bottom navbar */}
      <IonTabs>
        <IonRouterOutlet>
          <Route exact path="/tab1">
            <Tab1 />
          </Route>
          <Route exact path="/tab2">
            <Tab2 />
          </Route>
          <Route exact path="/service">
            <DailyHelp />
          </Route>

          <Route exact path="/Community">
            <Tab4 />
          </Route>
          <Route path="/maid-profile" component={Maid} exact />
          <Route path="/maid" component={MaidsList} exact />
          <Route path="/milkman-profile" component={milkManProfile} exact />
          <Route path="/milkman" component={milkManList} exact />
          <Route path="/directory" component={Directory} exact />
          <Route path="/noticeBoard" component={NoticeBoard} exact />
          <Route path="/societyBills" component={SocietyBills} exact />
          <Route path="/getHelp" component={GetHelp} exact />
          <Route path="/createTicket" component={CreateTicket} exact />
          <Route exact path="/">
            <Redirect to="/tab1" />
          </Route>
        </IonRouterOutlet>
        <IonTabBar slot="bottom">
          <IonTabButton tab="tab1" href="/tab1">
            <IonIcon aria-hidden="true" icon={home} />
            <IonLabel>Home</IonLabel>
          </IonTabButton>

          <IonTabButton tab="tab2" href="/tab2">
            <IonIcon aria-hidden="true" icon={storefront} />
            <IonLabel>Social</IonLabel>
          </IonTabButton>
          <IonTabButton tab="tab3" href="/service">
            <IonIcon aria-hidden="true" icon={hammer} />
            <IonLabel>Services</IonLabel>
          </IonTabButton>
          <IonTabButton tab="Community" href="/Community">
            <IonIcon aria-hidden="true" icon={business} />
            <IonLabel>Community</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  </IonApp>
);

export default App;
