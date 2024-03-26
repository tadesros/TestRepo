//https://medium.com/risan/track-users-location-and-display-it-on-google-maps-41d1f850786e


const createMap = ({ lat, lng }) => {
    return new google.maps.Map(document.getElementById('map'), {
 const getCurrentPosition = ({ onSuccess, onError = () => { } }) => {
    if ('geolocation' in navigator === false) {
      return onError(new Error('Geolocation is not supported by your browser.'));
    }
  
    return navigator.geolocation.getCurrentPosition(onSuccess, onError);
  };
  
  const getPositionErrorMessage = code => {
    switch (code) {
      case 1:
        return 'Permission denied.';
      case 2:
        return 'Position unavailable.';
      case 3:
        return 'Timeout reached.';
      default:
        return null;
    }
  }     center: { lat, lng },
      zoom: 15
    });
  };
  
  const createMarker = ({ map, position }) => {
    return new google.maps.Marker({ map, position });
  };
  
  
  
  function init() {
    const initialPosition = { lat: 59.325, lng: 18.069 };
    const map = createMap(initialPosition);
    const marker = createMarker({ map, position: initialPosition });
  
    getCurrentPosition({
      onSuccess: ({ coords: { latitude: lat, longitude: lng } }) => {
        marker.setPosition({ lat, lng });
        map.panTo({ lat, lng });
      },
      onError: err =>
        alert(`Error: ${getPositionErrorMessage(err.code) || err.message}`)
    });
  }