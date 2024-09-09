import { Redirect, Route, BrowserRouter as Router } from "react-router-dom";
import {
  IonApp,
  IonHeader,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonTitle,
  IonToolbar,
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
import Amenities from "./modules/community/Amenities";
import NoticeBoard from "./modules/community/NoticeBoard";
import SocietyBills from "./modules/community/SocietyBills";
import CreateTicket from "./modules/community/CreateTicket";
import GetHelp from "./modules/community/GetHelp";
import Signup from "./modules/auth/Signup";
import DailyHelp from "./modules/services/DailyHelp";
import Maid from "./modules/services/DailyHelp/Maid/Maid";
import MaidsList from "./modules/services/DailyHelp/Maid/MaidList";
import MilkManProfile from "./modules/services/DailyHelp/milk/Milkman";
import milkManList from "./modules/services/DailyHelp/milk/MilkmanList";
import BookingAmenity from "./modules/community/BookingAmenity";
import Profile from "./modules/profile/Profile";
import Notifications from "./modules/home/Notifications";
import EditProfile from "./modules/profile/EditProfile";
import ResetPassword from "./modules/profile/ResetPassword";

setupIonicReact();

const App: React.FC = () => (
  <IonApp>

    <IonReactRouter>
      <IonRouterOutlet>
        <Route exact path="/signup">
          <Signup />
        </Route>
        <Route exact path="/">
          <Redirect to="/tab1" />
        </Route>
      </IonRouterOutlet>

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
          <Route path="/milkman-profile" component={MilkManProfile} exact />
          <Route path="/milkman" component={milkManList} exact />
          <Route path="/directory" component={Directory} exact />
          <Route path="/noticeBoard" component={NoticeBoard} exact />
          <Route path="/societyBills" component={SocietyBills} exact />
          <Route path="/getHelp" component={GetHelp} exact />
          <Route path="/createTicket" component={CreateTicket} exact />
          <Route path="/amenities" component={Amenities} exact />
          <Route path="/bookAmenity" component={BookingAmenity} exact />
          <Route path="/profile" component={Profile} exact />
          <Route path="/notifications" component={Notifications} exact />
          <Route path="/editProfile" component={EditProfile} exact />
          <Route path="/resetPassword" component={ResetPassword} exact />
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
