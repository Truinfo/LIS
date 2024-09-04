import React from "react";
import {
  IonContent,
  IonPage,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardContent,
  IonText,
  IonImg,
  useIonRouter
} from "@ionic/react";
import { useHistory } from "react-router-dom";
import "./DailyHelp.css"; // Create this CSS file to handle custom styling
import cleaningservice from "../../assets/Images/bucket.png";
import milk from "../../assets/Images/milk (1).png";
import frying from "../../assets/Images/frying-pan.png";
import newspaper from "../../assets/Images/newspaper (2).png";
import driver from "../../assets/Images/driver-license.png";
import gallon from "../../assets/Images/gallon.png";
import Plumber from "../../assets/Images/Plumber.png";
import Carpenter from "../../assets/Images/Carpenter.png";
import Electrician from "../../assets/Images/Electrician.png";
import Painter from "../../assets/Images/Painter (2).png";
import Moving from "../../assets/Images/Moving.png";
import Appliance from "../../assets/Images/Appliance.png";
import Pest from "../../assets/Images/Pest Clean.png";
import Mechanic from "../../assets/Images/Mechanic.png";
import Maid from "./DailyHelp/Maid";

const services = [
  
  {
    category: "Daily Help",
    items: [
      { name: "Maid", icon: cleaningservice },
      { name: "Milkman", icon: milk },
      { name: "Cook", icon: frying },
      { name: "Paper", icon: newspaper },
      { name: "Driver", icon: driver },
      { name: "Water", icon: gallon },
    ],
  },
  {
    category: "Technical Help",
    items: [
      { name: "Plumber", icon: Plumber },
      { name: "Carpenter", icon: Carpenter },
      { name: "Electrician", icon: Electrician },
      { name: "Painter", icon: Painter },
      { name: "Moving", icon: Moving },
      { name: "Mechanic", icon: Mechanic },
      { name: "Appliance", icon: Appliance },
      { name: "Pest Clean", icon: Pest },
    ],
  },
];

const DailyHelp: React.FC = () => {
  const route=useIonRouter()
  const history = useHistory();
  const handleNavigation = (name: string) => {
    route.push(`/${name.toLowerCase().replace(" ", "")}`);
  };

  return (
    <IonPage>
      <IonContent>
        {services.map((service, index) => (
          <div key={index}>
            <div className="category-header">
              <IonImg src={service.items[0].icon} className="category-icon" />
              <div>
                <IonText className="category-title">{service.category}</IonText>
                <IonText className="category-subtitle">
                  On special insistence of our dealer's
                </IonText>
              </div>
            </div>
            <IonGrid>
              <IonRow>
                {service.items.map((item, idx) => (
                  <IonCol size="3" key={idx}>
                    <IonCard
                      onClick={() => handleNavigation(item.name)}
                      className="service-card"
                    >
                      <IonImg src={item.icon} className="service-icon" />
                    </IonCard>
                    <IonCardContent className="service-name">
                      {item.name}
                    </IonCardContent>
                  </IonCol>
                ))}
              </IonRow>
            </IonGrid>
          </div>
        ))}
      </IonContent>
    </IonPage>
  );
};

export default DailyHelp;
