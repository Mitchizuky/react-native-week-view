import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  item: {
    //alignItems: 'center',
    position: 'absolute',
    paddingVertical: 3,
    paddingHorizontal: 3,
    borderWidth: 1,
    borderColor: '#E9EDF0',
    flex: 1,
    marginRight: 1,
    borderRadius: 10,
    paddingLeft: 7.5,
    paddingTop: 5
  },
  description: {
    color: 'rgb(0,6,69)',
    fontWeight: 'bold',
    //textAlign: 'center',
    fontSize: 12,
  },
  time: {
    color: 'rgb(0,6,69)',

    //textAlign: 'center',
    fontSize: 12,
  },
});

export default styles;
