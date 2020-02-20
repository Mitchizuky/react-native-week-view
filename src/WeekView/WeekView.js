import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  ScrollView,
  Dimensions,
  Text,
  Alert,
  TouchableOpacity,
} from 'react-native';
import moment from 'moment';
import { setLocale } from '../utils';
import Events from '../Events/Events';
import Header from '../Header/Header';
import styles from './WeekView.styles';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const TIME_LABELS_COUNT = 48;

export default class WeekView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentMoment: props.selectedDate,
    };
    this.calendar = null;
    setLocale(props.locale);
    this.times = this.generateTimes();
  }

  shouldComponentUpdate(prevProps, prevState) {
		return prevProps !== this.props || prevState !== this.state;
	}

  componentDidMount() {
    requestAnimationFrame(() => {
      this.calendar.scrollTo({ y: 0, x: 2 * (SCREEN_WIDTH - 70), animated: false });
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.locale !== this.props.locale) {
      setLocale(nextProps.locale);
    }
  }

  componentDidUpdate() {
    this.calendar.scrollTo({ y: 0, x: 2 * (SCREEN_WIDTH - 70), animated: false });
  }

  generateTimes = () => {
    const times = [];

    const startTime = new Date();
    const endTime = new Date();

    this.props.minHours && this.props.minHours !== 0 ? startTime.setHours(this.props.minHours) : startTime.setHours(0);
    this.props.minMinutes && this.props.minMinutes !== 0 ? startTime.setMinutes(this.props.minMinutes) : startTime.setMinutes(0);

    if (startTime.getMinutes() < 30) {
      startTime.setMinutes(0);
    }
    
    this.props.maxHours && this.props.maxHours !== 0 ? endTime.setHours(this.props.maxHours) : endTime.setHours(23);
    this.props.maxMinutes && this.props.maxMinutes !== 0 ? endTime.setMinutes(this.props.maxMinutes) : endTime.setMinutes(30);

    if (endTime.getMinutes() > 30) {
      endTime.setMinutes(0);
      endTime.setHours(endTime.getHours() + 1);
    }

    times.push(startTime);

    for (let i = 0; i < TIME_LABELS_COUNT; i += 1) {
      const time = new Date();
      const minutes = i % 2 === 0 ? '00' : '30';
      const hour = Math.floor(i / 2);

      time.setHours(hour);
      time.setMinutes(minutes);
      times.push(time);
    }

    times.push(endTime);

    const filteredTimes = [];

    for (let index = 0; index < times.length; index++) {
      const tempTime = times[index];

      if (tempTime.getTime() >= startTime.getTime() && 
      tempTime.getTime() <= endTime.getTime() && 
      !filteredTimes.some(x => x.getTime() === tempTime.getTime())) {
        filteredTimes.push(tempTime);
      }
    }

    return filteredTimes.map(x => {
      return `${('0' + x.getHours()).slice(-2)}:${('0' + x.getMinutes()).slice(-2)}`;
    });;
  };

  scrollEnded = (event) => {
    const { nativeEvent: { contentOffset, contentSize } } = event;
    const { x: position } = contentOffset;
    const { width: innerWidth } = contentSize;
    const newPage = (position / innerWidth) * 5;
    const { onSwipePrev, onSwipeNext, numberOfDays } = this.props;
    const { currentMoment } = this.state;
    requestAnimationFrame(() => {
      const newMoment = moment(currentMoment)
        .add((newPage - 2) * numberOfDays, 'd')
        .toDate();

      this.setState({ currentMoment: newMoment });

      if (newPage < 2) {
        onSwipePrev && onSwipePrev(newMoment);
      } else if (newPage > 2) {
        onSwipeNext && onSwipeNext(newMoment);
      }
    });
  };

  scrollViewRef = (ref) => {
    this.calendar = ref;
  }

  prepareDates = (currentMoment, numberOfDays) => {
    const dates = [];
    for (let i = -2; i < 3; i += 1) {
      const date = moment(currentMoment).add(numberOfDays * i, 'd');
      dates.push(date);
    }
    return dates;
  };

 

  render() {
    const {
      numberOfDays,
      headerStyle,
      formatDateHeader,
      onEventPress,
      events,
      onEmptyCellPress,
      onEventLongPress
    } = this.props;
    const { currentMoment } = this.state;
    const dates = this.prepareDates(currentMoment, numberOfDays);
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Header
            style={headerStyle}
            formatDate={formatDateHeader}
            selectedDate={currentMoment}
            numberOfDays={numberOfDays}
          />
        </View>
        <ScrollView>
          <View style={styles.scrollViewContent}>
            <View style={styles.timeColumn}>
              {this.times.map(time => (
                <View key={time} style={styles.timeLabel}>
                  <Text style={styles.timeText}>{time}</Text>
                </View>
              ))}
            </View>
            <ScrollView
              horizontal
              pagingEnabled
              automaticallyAdjustContentInsets={false}
              onMomentumScrollEnd={this.scrollEnded}
              ref={this.scrollViewRef}
            >
              {dates.map(date => (
               
                <View
                  key={date}
                  style={{ flex: 1, width: SCREEN_WIDTH - 70}}
                >
                 
                  <Events
                    numberOfDays={numberOfDays}
                    currentDate={date}
                    key={dates}
                    times={this.times}
                    selectedDate={date.toDate()}
                    numberOfDays={numberOfDays}
                    onEventPress={onEventPress}
                    events={events}
                    onEventLongPress={onEventLongPress}
                    onEmptyCellPress={onEmptyCellPress}
                  />
                
                </View>
                
              ))}
            </ScrollView>
          </View>
        </ScrollView>
      </View>
    );
  }
}

WeekView.propTypes = {
  events: Events.propTypes.events,
  numberOfDays: PropTypes.oneOf([1, 3, 7]).isRequired,
  onSwipeNext: PropTypes.func,
  onSwipePrev: PropTypes.func,
  formatDateHeader: PropTypes.string,
  onEventPress: PropTypes.func,
  headerStyle: PropTypes.object,
  selectedDate: PropTypes.instanceOf(Date).isRequired,
  locale: PropTypes.string,
  onEmptyCellPress:PropTypes.func,
  onEventLongPress:PropTypes.func,
  minHours: PropTypes.number,
  minMinutes: PropTypes.number,
  maxHours: PropTypes.number,
  maxMinutes: PropTypes.number
};

WeekView.defaultProps = {
  events: [],
  locale: 'en',
};
