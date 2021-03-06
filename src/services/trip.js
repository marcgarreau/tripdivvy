import { AsyncStorage } from 'react-native';
import { assign, find, reject, remove } from 'lodash';

class Trip {
  addTrip(trip) {
    return this.getTrips()
      .then(trips => {
        trips.push({ name: trip.name, travelers: trip.travelers, expenses: [] });
        return JSON.stringify(trips);
      })
      .then(tripsJSON => {
        AsyncStorage.setItem('trips', tripsJSON);
      })
  }

  deleteTrip(tripName) {
    return this.getTrips()
      .then(trips => {
        remove(trips, trip => {
          return trip.name === tripName;
        });
        return JSON.stringify(trips);
      })
      .then(tripsJSON => {
        AsyncStorage.setItem('trips', tripsJSON);
      });
  }

  getTrips() {
    return AsyncStorage.getItem('trips')
      .then(
        tripJSON => {
          return JSON.parse(tripJSON || '[]')
        }
      );
  }

  getTrip(tripName) {
    return AsyncStorage.getItem('trips')
      .then(
        tripJSON => {
          const trips = JSON.parse(tripJSON || '[]')
          return find(trips, trip => {
            return trip.name === tripName;
          });
        }
      );
  }

  addTraveler(tripName, traveler) {
    return this.getTrips()
      .then(_trips => {
        trips = _trips;

        return remove(_trips, trip => {
          return trip.name === tripName;
        })[0];
      })
      .then(trip => {
        return assign({}, trip, {
          travelers: trip.travelers.concat(traveler)
        });
      })
      .then(updatedTrip => {
        trips.push(updatedTrip);
        return JSON.stringify(trips);
      })
      .then(tripsJSON => {
        AsyncStorage.setItem('trips', tripsJSON);
      });
  }

  addExpense(tripName, expense) {
    let trips;
    return this.getTrips()
      .then(_trips => {
        trips = _trips;

        return remove(_trips, trip => {
          return trip.name === tripName;
        })[0];
      })
      .then(trip => {
        return assign({}, trip, {
          expenses: trip.expenses.concat(expense)
        });
      })
      .then(updatedTrip => {
        trips.push(updatedTrip);
        return JSON.stringify(trips);
      })
      .then(tripsJSON => {
        AsyncStorage.setItem('trips', tripsJSON);
      })
  }

  deleteExpense(tripName, expense) {
    let trips;
    return this.getTrips()
      .then(_trips => {
        trips = _trips;

        return remove(_trips, trip => {
          return trip.name === tripName;
        })[0];
      })
      .then(trip => {
        return assign({}, trip, {
          expenses: reject(trip.expenses, expense)
        });
      })
      .then(updatedTrip => {
        trips.push(updatedTrip);
        return JSON.stringify(trips);
      })
      .then(tripsJSON => {
        AsyncStorage.setItem('trips', tripsJSON);
      })
  }
}

export default new Trip();
