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
<<<<<<< HEAD
import Directory from "./modules/community/Directory";
import Tab4 from "./pages/Tab4";
import Amenities from "./modules/community/NoticeBoard";
import NoticeBoard from "./modules/community/NoticeBoard";
import SocietyBills from "./modules/community/SocietyBills";
import GetHelp from "./modules/community/GetHelp";
import AddForum from "./modules/community/AddForum";
=======
>>>>>>> b3ceec40722d815bbd36560df801ddf5f6c9d358

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        {/* Routes that should not display the bottom navbar */}
        <Route exact path="/signup">
          <SignUp />
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
          <Route exact path="/tab3">
            <Tab3 />
          </Route>
<<<<<<< HEAD
          <Route exact path="/Community">
            <Tab4 />
          </Route>
          <Route path="/directory" component={Directory} exact />
          <Route path="/noticeBoard" component={NoticeBoard} exact />
          <Route path="/societyBills" component={SocietyBills} exact />
          <Route path="/getHelp" component={GetHelp} exact />
          <Route path="/addForum" component={AddForum} exact />
=======
          <Route exact path="/">
            <Redirect to="/tab1" />
          </Route>
>>>>>>> b3ceec40722d815bbd36560df801ddf5f6c9d358

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
          <IonTabButton tab="tab3" href="/tab3">
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
