import {
  IonBackButton,
  IonButtons,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import {
  notificationsOutline,
  personCircleOutline,
  reorderFourOutline,
} from "ionicons/icons";
import "./Home.css";
const Home: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonGrid>
            <IonRow className="ion-align-items-center">
              <IonRow className="ion-align-items-center">
                <IonIcon icon={reorderFourOutline} size="large" />
                <IonCol>
                  <div>
                    <strong>Kishore</strong>
                    <br />
                    <span>Block-A, 303</span>
                  </div>
                </IonCol>
              </IonRow>
              <IonCol className="ion-text-right">
                <IonIcon
                  icon={notificationsOutline}
                  size="large"
                  className="ion-margin-end"
                />
                <IonIcon icon={personCircleOutline} size="large" />
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonGrid className="home-container">
          <IonTitle>hello home</IonTitle>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};
export default Home;
