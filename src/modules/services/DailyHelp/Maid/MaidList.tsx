import React from "react";
import {
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonImg,
  IonGrid,
  IonText,
  IonIcon,
  useIonRouter,
  IonItem,
  IonAvatar,
  IonLabel,
  IonList,
} from "@ionic/react";
import "./Maid.css";
import maid from "../../../assets/Images/maid1.png";
import {
  call,
  locationOutline,
  star,
  arrowBack,
  chevronForward,
} from "ionicons/icons";
import profile from "../../../../assets/Images/madiProfile.jpg";
const MaidsList: React.FC = () => {
  const route = useIonRouter();
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>
            {" "}
            <IonIcon
              icon={arrowBack}
              size="small"
              className="back-button"
              color="black"
              onClick={() => route.push(`/service`)}
            />
            Maid list
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonGrid>
          <IonList>
            {[...Array(4)].map((_, index) => (
              <IonItem
                key={index}
                className="list-Card"
                onClick={() => route.push(`/maid-profile`)}
              >
                <IonAvatar
                  aria-hidden="true"
                  slot="start"
                  className="avatar-img"
                >
                  <img alt="profile" src={profile} />
                </IonAvatar>
                <IonGrid className="detail-container">
                  <IonGrid>
                    <IonLabel>Aruna</IonLabel>
                    <IonLabel style={{ color: "#525151" }}>
                      <IonIcon
                        icon={locationOutline}
                        size="small"
                        className="location-button"
                        color="black"
                        onClick={() => route.push(`/service`)}
                      />
                      Chandram palem , Madhurawada
                    </IonLabel>
                  </IonGrid>
                  <IonIcon
                    icon={chevronForward}
                    size="small"
                    className=".navigate-button"
                    style={{
                      color: "#807d7d",
                      outerHeight: "40px",
                      outerWidth: "40px",
                    }}
                  />
                </IonGrid>
              </IonItem>
            ))}
          </IonList>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default MaidsList;
