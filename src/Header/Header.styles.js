import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    paddingLeft: 5,
    borderBottomColor:'#E9EDF0',
    borderBottomWidth: 1,
    textAlign:'center'
  },
  columns: {
    flex: 1,
    flexDirection: 'row',
  },
  column: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomColor: '#E9EDF0',
    borderBottomWidth: 1,
  },
  text: {
    color: '#ababab',
  },
});

export default styles;
