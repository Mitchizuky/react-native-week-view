import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewContent: {
    flexDirection: 'row',
  },
  header: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeLabel: {
    flex: -1,
    height: 40,
  },
  timeText: {
    fontSize: 13,
    textAlign: 'center',
    color:'#000000'
  },
  timeColumn: {
    paddingTop: 7,
    width: 70,
  },
});

export default styles;
