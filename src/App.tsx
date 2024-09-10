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
import DailyHelp from "./modules/services/DailyHelp";
import Maid from "./modules/services/DailyHelp/Maid/Maid";
import MaidsList from "./modules/services/DailyHelp/Maid/MaidList";
import MilkManProfile from "./modules/services/DailyHelp/milk/Milkman";
import milkManList from "./modules/services/DailyHelp/milk/MilkmanList";
import BookingAmenity from "./modules/community/BookingAmenity";
import Profile from "./modules/profile/Profile";
import Notifications from "./modules/home/Notifications";
import Home from "./modules/home/Home";
import Signup from "./modules/auth/Signup";
import CookProfile from "./modules/services/DailyHelp/cook/Cook";
import CookList from "./modules/services/DailyHelp/cook/CookList";
import PaperProfile from "./modules/services/DailyHelp/paper/Paper";
import WaterProfile from "./modules/services/DailyHelp/water/Water";
import PaperList from "./modules/services/DailyHelp/paper/PaperList";
import WaterList from "./modules/services/DailyHelp/water/WaterList";
import Plumber from "./modules/services/TechnicalService/PlumberList";
import Carpenter from "./modules/services/TechnicalService/Carpenter";
import Electrical from "./modules/services/TechnicalService/Electrical";
import Painter from "./modules/services/TechnicalService/Painter";
import BoxMovers from "./modules/services/TechnicalService/BoxMovers";
import Mechanic from "./modules/services/TechnicalService/Mechanic";
import Appliances from "./modules/services/TechnicalService/Appliances";
import PestClean from "./modules/services/TechnicalService/PestClean";
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
          <Redirect to="/home" />
        </Route>
      </IonRouterOutlet>

      <IonTabs>
        <IonRouterOutlet>
          <Route exact path="/home">
            <Home />
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
          <Route path="/cook-profile" component={CookProfile} exact />
          <Route path="/cook" component={CookList} exact />
          <Route path="/paper-profile" component={PaperProfile} exact />
          <Route path="/paper" component={PaperList} exact />
          <Route path="/water-profile" component={WaterProfile} exact />
          <Route path="/water" component={WaterList} exact />
          <Route path="/plumber" component={Plumber} exact />
          <Route path="/carpenter" component={Carpenter} exact />
          <Route path="/electrician" component={Electrical} exact />
          <Route path="/painter" component={Painter} exact />
          <Route path="/moving" component={BoxMovers} exact />
          <Route path="/mechanic" component={Mechanic} exact />
          <Route path="/appliance" component={Appliances} exact />
          <Route path="/pestclean" component={PestClean} exact />
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
            <Redirect to="/home" />
          </Route>
        </IonRouterOutlet>
        <IonTabBar slot="bottom">
          <IonTabButton tab="tab1" href="/home">
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
