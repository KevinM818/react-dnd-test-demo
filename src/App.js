import {useState} from 'react';
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import './index.css';

const initialMods = {
  engineMods: [
    {_id: '01', value: 'test 1'},
    {_id: '02', value: 'test 2'},
    {_id: '03', value: 'test 3', productTitle: 'Product One', productHandle: 'product-one'},
    {_id: '04', value: 'test 4'},
    {_id: '05', value: 'test 5', productTitle: 'Product Two', productHandle: 'product-two'},
    {_id: '06', value: 'test 6', productTitle: 'Product Three', productHandle: 'product-three'},
    {_id: '07', value: 'test 7', productTitle: 'Product Four', productHandle: 'product-four'},
    {_id: '08', value: 'test 8'},
  ],
  brakeMods: [
    {_id: '11', value: 'test 9'},
    {_id: '12', value: 'test 10'},
    {_id: '13', value: 'test 11', productTitle: 'Product Five', productHandle: 'product-five'},
    {_id: '14', value: 'test 12'},
    {_id: '15', value: 'test 13', productTitle: 'Product Six', productHandle: 'product-six'}
  ]
}

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed)
  return result;
}

const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);
  destClone.splice(droppableDestination.index, 0, removed);
  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;
  return result;
}

const ItemList = ({mods}) => mods.map((mod, index) => (
  <Draggable draggableId={mod._id} index={index} key={mod._id}>
    {provided => (
      <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className='ModList__item'>
        <h3>{mod.value}</h3>
        {mod.productTitle && <p>{mod.productTitle}</p>}
        {mod.productHandle && <p>{mod.productHandle}</p>}
      </div>
    )}
  </Draggable>
));

const App = () => {
  const [mods, setMods] = useState(initialMods);
  
  const onDragEnd = result => {
    const {source, destination} = result;
    if (!destination) {return;}
    if (source.droppableId === destination.droppableId) {
      const items = reorder(mods[source.droppableId], source.index, destination.index);
      const state = {...mods};
      state[source.droppableId] = items;
      setMods(state);
    } else {
      const result = move(mods[source.droppableId], mods[destination.droppableId], source, destination);
      const state = {...mods};
      state[source.droppableId] = result[source.droppableId];
      state[destination.droppableId] = result[destination.droppableId];
      setMods(state);
    }
  }
  
  return (
    <div className='container'>
      <DragDropContext onDragEnd={onDragEnd}>
        {Object.keys(mods).map(key => (
          <Droppable droppableId={key} key={key}>
            {provided => (
              <div
                className='ModList'
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <ItemList mods={mods[key]}/>
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </DragDropContext>
    </div>
  );
};

export default App;
