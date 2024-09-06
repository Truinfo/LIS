import { IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonPage, IonRow, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Tab2.css';
import { notificationsOutline, personCircleOutline, reorderFourOutline } from 'ionicons/icons';

const Tab2: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonGrid>
            <IonRow className="ion-align-items-center">
              <IonRow className="ion-align-items-center">
                <IonIcon
                  icon={reorderFourOutline}
                  size="large"
                />
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
                <IonIcon
                  icon={personCircleOutline}
                  size="large"
                />
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Tab 2</IonTitle>
          </IonToolbar>
        </IonHeader>
        <ExploreContainer name="Tab 2 page" />
      </IonContent>
    </IonPage>
  );
};

export default Tab2;
