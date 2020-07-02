import React, { Component } from 'react';
import PropTypes, { number } from 'prop-types';
import {
  View,
  Dimensions,
  TouchableOpacity,
  Text,
  Alert,
  TouchableWithoutFeedback
} from 'react-native';
import moment from 'moment';

import Event from '../Event/Event';

import styles, { CONTENT_OFFSET } from './Events.styles';

const { width: screenWidth } = Dimensions.get('window');
const MINUTES_IN_HOUR = 60;
const ROW_HEIGHT = 40;
const TIME_LABEL_WIDTH = 40;
const EVENTS_CONTAINER_WIDTH = screenWidth - TIME_LABEL_WIDTH - 1;
const CELL_VALUE_IN_MINUTES = 30;

class Events extends Component {
  onEventPress = (event) => {
    const { onEventPress } = this.props;
    if (onEventPress) {
      onEventPress(event);
    }
  };

  onEventLongPress = (event) => {
    const { onEventLongPress } = this.props;
    if (onEventLongPress) {
      onEventLongPress(event);
    }
  };

  onEmptyPress = (event) => {
    const { onEventPress } = this.props;
    if (onEventPress) {
      onEventPress(event);
    }
  };

  onEmptyLongPress = (event) => {
    const { onEmptyCellLongPress } = this.props;
    if (onEmptyCellLongPress) {
      onEmptyCellLongPress(event);
    }
  };

  getEventsByNumberOfDays = (numberOfDays, events, selectedDate) => {
    // total stores events in each day of numberOfDays
    // example: [[event1, event2], [event3, event4], [event5]], each child array
    // is events for specific day in range
    const total = [];
    let initial = 0;
    if (numberOfDays === 7) {
      initial = 1;
      initial -= moment().isoWeekday();
    }
    for (let i = initial; i < (numberOfDays + initial); i += 1) {
      // current date in numberOfDays, calculated from selected date
      const currenDate = moment(selectedDate).add(i, 'd');

      // filter events that have startDate/endDate in current date
      let filteredEvents = events.filter((item) => {
        return currenDate.isSame(item.startDate, 'day') || currenDate.isSame(item.endDate, 'day');
      });

      filteredEvents = filteredEvents.map((item) => {
        let { startDate } = item;
        // if endDate is in next day, set starDate to begin time of current date (00:00)
        if (!currenDate.isSame(startDate, 'day')) {
          startDate = currenDate.startOf('day').toDate();
        }
        return {
          ...item,
          startDate,
        };
      });
      total.push(filteredEvents);
    }
    return total;
  };

  getStyleForEvent = (item) => {
    const contentHeight = ROW_HEIGHT * this.props.times.length;
    const minutesInDay = MINUTES_IN_HOUR * this.props.times.length / 2;

    const startHours = moment(item.startDate).hours() - this.props.startTime;
    const startMinutes = moment(item.startDate).minutes();
    const totalStartMinutes = (startHours * MINUTES_IN_HOUR) + startMinutes;
    const topOffset = Math.floor((totalStartMinutes * contentHeight) / minutesInDay);
    const height = (moment(item.endDate).diff(item.startDate, 'minutes') * contentHeight) / minutesInDay;
    const width = this.getEventItemWidth();

    return {
      top: topOffset + CONTENT_OFFSET,
      left: 0,
      height,
      width,
    };
  };

  getEventsWithPosition = (totalEvents) => {
    const itemWidth = this.getEventItemWidth();
    return totalEvents.map((events) => {
      // get position and width for each event
      const eventsWithStyle = events.reduce((eventsAcc, event, i) => {
        let numberOfDuplicate = 1;
        const style = this.getStyleForEvent(event);
        // check if previous events have the same position or not,
        // start from 0 to current index of event item
        for (let j = 0; j < i; j += 1) {
          const previousEvent = eventsAcc[j];
          // if left and top of previous event collides with current item,
          // move current item to the right and update new width for both
          const foundDuplicate = previousEvent.style.left === style.left
            && previousEvent.style.top + previousEvent.style.height > style.top;
          if (foundDuplicate) {
            numberOfDuplicate += 1;
            style.left = (itemWidth / numberOfDuplicate);
            style.width = itemWidth / numberOfDuplicate;
            previousEvent.style.width = itemWidth / numberOfDuplicate;
          }
        }
        eventsAcc.push({
          data: event,
          style,
        });
        return eventsAcc;
      }, []);
      return eventsWithStyle;
    });
  };

  getEventItemWidth = () => {

    const { numberOfDays } = this.props;
    return EVENTS_CONTAINER_WIDTH / numberOfDays;
  };

  sortEventByDates = (events) => {
    const sortedEvents = events.slice(0)
      .sort((a, b) => {
        return moment(a.startDate)
          .diff(b.startDate, 'minutes');
      });
    return sortedEvents;
  };

  createCellData(evt, date, columnIndex) {
    let selectedDate = date.toDate();
    selectedDate.setDate(selectedDate.getDate() + columnIndex);
    let cellRowIndex = parseInt((evt.nativeEvent.locationY + 16) / 40);

    let cellIndexToMinutes = cellRowIndex * CELL_VALUE_IN_MINUTES;
    let selectedHour = this.props.startTime + (cellIndexToMinutes / 60);
    let selectedMinutes = cellIndexToMinutes % 60;

    if (selectedMinutes === 30) {
      selectedMinutes = 0;
    }
    else {
      selectedMinutes = 30;
      selectedHour = selectedHour - 1;
    }

    selectedDate.setHours(selectedHour, selectedMinutes, 0, 0);

    let cellData = {
      hourCellIndex: cellRowIndex,
      selectedDate: selectedDate
    }

    return cellData;
  }

  handleEmptyCellPress(evt, date, columnIndex) {

    const cellData = this.createCellData(evt, date, columnIndex)

    const { onEmptyCellPress } = this.props;
    if (onEmptyCellPress) {
      onEmptyCellPress(cellData);
    }
  }

  handleEmptyLongCellPress(evt, date, columnIndex) {
    const cellData = this.createCellData(evt, date, columnIndex)

    const { onEmptyCellLongPress } = this.props;
    if (onEmptyCellLongPress) {
      onEmptyCellLongPress(cellData);
    }
  }

  render() {
    const {
      currentDate,
      events,
      numberOfDays,
      selectedDate,
      times,
    } = this.props;
    const sortedEvents = this.sortEventByDates(events);
    let totalEvents = this.getEventsByNumberOfDays(numberOfDays, sortedEvents, selectedDate);
    totalEvents = this.getEventsWithPosition(totalEvents);
    return (
      <View style={styles.container}>
        {times.map((time, index) => {
          if (index % 2 === 0) {
            return (
              <View key={time} style={[styles.timeRow, { backgroundColor: 'white' }]}>
                <View style={[styles.timeLabelLine, { height: 2 }]} >
                </View>
              </View>
            )
          }

          return (
            <View key={time} style={[styles.timeRow, { backgroundColor: 'white' }]}>
              <View style={[styles.timeLabelLine]} >
              </View>
            </View>
          )
        })}
        <View style={[styles.events]}>

          {totalEvents.map((eventsInSection, sectionIndex) => (
            <TouchableWithoutFeedback
              onLongPress={(evt) => this.handleEmptyLongCellPress(evt, currentDate, sectionIndex)}
              onPress={(evt) => this.handleEmptyCellPress(evt, currentDate, sectionIndex)}
            >
              <View
                key={sectionIndex}
                style={styles.event}
              >
                {eventsInSection.map(item => (
                  <Event
                    key={item.data.id}
                    event={item.data}
                    style={item.style}
                    onPress={this.onEventPress}
                    onLongPress={this.onEventLongPress}
                  />
                ))}

              </View>
            </TouchableWithoutFeedback>
          ))}

        </View>
      </View>
    );
  }
}

Events.propTypes = {
  currentDate: String,
  numberOfDays: PropTypes.oneOf([1, 3, 7]).isRequired,
  events: PropTypes.arrayOf(Event.propTypes.event),
  onEventPress: PropTypes.func,
  selectedDate: PropTypes.instanceOf(Date),
  times: PropTypes.arrayOf(PropTypes.string),
  onEmptyCellPress: PropTypes.func,
  onEmptyCellLongPress: PropTypes.func,
  onEventLongPress: PropTypes.func,
  onEmptyCellLongPress: PropTypes.func,
  startTime: PropTypes.number
};

Events.defaultProps = {
  events: [],
  selectedDate: new Date(),
};

export default Events;
