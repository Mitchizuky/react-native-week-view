import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewContent: {
    flexDirection: 'row',
  },
  header: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeLabel: {
    flex: -1,
    height: 40,
  },
  timeText: {
    paddingTop: 9,
    paddingLeft: 10,
    fontSize: 16,
    color:'#ababab',
    borderTopColor: '#E9EDF0',
    borderTopWidth: 1
  },
  timeColumn: {
    paddingTop: 0,
    width: 40,
  },
});

export default styles;
