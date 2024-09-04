import React, { useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonCardSubtitle } from '@ionic/react';
import './addsList.css';

const Ads: React.FC = () => {

  const ads = [
    {
      id: 1,
      title: '50% Off on Electronics',
      subtitle: 'Valid until 30th September',
      images: [
        'https://thumbor.forbes.com/thumbor/fit-in/900x510/https://www.forbes.com/home-improvement/wp-content/uploads/2022/07/Paris_Exterior_4-Edit-e1714649473120.png',
        'https://via.placeholder.com/150/1',
        'https://via.placeholder.com/150/2'
      ],
      description: 'Get the best deals on electronics. Limited time offer!',
    },
    {
      id: 2,
      title: 'Buy 1 Get 1 Free',
      subtitle: 'On all Fashion Wear',
      images: [
        'https://via.placeholder.com/150/3',
        'https://via.placeholder.com/150/4'
      ],
      description: 'Amazing offer on fashion wear. Hurry up before it ends!',
    },
    {
      id: 3,
      title: 'Special Discount on Groceries',
      subtitle: 'Flat 20% off',
      images: [
        'https://via.placeholder.com/150/5',
        'https://via.placeholder.com/150/6'
      ],
      description: 'Save big on your daily groceries with our special discount.',
    },
  ];

  return (
    <IonPage>
      <IonHeader className='AddsHeader'>
        <IonToolbar>
          <IonTitle className='AddsIonTitle'>Advertisements</IonTitle>
        </IonToolbar>
        <IonButton
          className='AddsIonButton'
          color={"#ccc"}
          onClick={() => {
            console.log('Post Advertisement clicked');
          }}
        >
          Post
        </IonButton>
      </IonHeader>
      <IonContent>
        {ads.map((ad) => (
          <IonCard className="AddsIonContent" key={ad.id}>
            <Carousel images={ad.images} />
            <IonCardHeader>
              <IonCardTitle>{ad.title}</IonCardTitle>
              <IonCardSubtitle>{ad.subtitle}</IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent>
              {ad.description}
            </IonCardContent>
          </IonCard>
        ))}
      </IonContent>
    </IonPage>
  );
};

interface CarouselProps {
  images: string[];
}

const Carousel: React.FC<CarouselProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  return (
    <div className="carousel">
      <div className="carousel-inner" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
        {images.map((image, index) => (
          <img key={index} src={image} className="carousel-image" alt={`Slide ${index}`} />
        ))}
      </div>
      <button className="carousel-control prev" onClick={goToPrevious}>&#10094;</button>
      <button className="carousel-control next" onClick={goToNext}>&#10095;</button>
    </div>
  );
};

export default Ads;
