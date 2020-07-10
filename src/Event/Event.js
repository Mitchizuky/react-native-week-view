import React from 'react';
import PropTypes from 'prop-types';
import {
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import styles from './Event.styles';

const Event = ({ event, onPress,onLongPress,style }) => {

    const getTime = () => {
        return ('0' + event.startDate.getHours()).slice(-2) +
        ':' +
        ('0' + event.startDate.getMinutes()).slice(-2) +
        ' - ' +
        ('0' + event.endDate.getHours()).slice(-2) +
        ':' +
        ('0' + event.endDate.getMinutes()).slice(-2);
    }

  if (event.isClose) {
      return (
          <TouchableWithoutFeedback
              onLongPress={()=>onLongPress(event)}
              onPress={() => onPress(event)}
          >
              <View
                  style={[styles.item, style, {
                      backgroundColor: '#c5575769',
                      borderRadius: 0
                  }]}
              >
                  <Text style={styles.description}>{event.description}</Text>
              </View>
          </TouchableWithoutFeedback>
      )
  }
  return (
      <TouchableOpacity
          onLongPress={()=>onLongPress(event)}
          onPress={() => onPress(event)}
          style={[styles.item, style, {
              backgroundColor: event.color,
          }]}
      >
          <Text style={[styles.description,{marginBottom:scale(5)}]}>{event.services}</Text>
          <Text style={styles.description}>{event.description}</Text>
          <Text style={styles.time}>{getTime()}</Text>
      </TouchableOpacity>
);
};

const eventPropTypes = PropTypes.shape({
  color: PropTypes.string,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  description: PropTypes.string,
  startDate: PropTypes.instanceOf(Date).isRequired,
  endDate: PropTypes.instanceOf(Date).isRequired,
});

Event.propTypes = {
  event: eventPropTypes.isRequired,
  onPress: PropTypes.func,
  style: PropTypes.object,
  onLongPress:PropTypes.object
};

export default Event;
