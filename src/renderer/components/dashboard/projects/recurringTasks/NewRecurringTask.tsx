import React, {useState} from 'react';
import { RecurringTask } from 'src/models/recurringTask';

interface NewRecurringTaskProps {
  setAddingTask: React.Dispatch<React.SetStateAction<boolean>>;
  accountID: number | undefined;
  setRecurringTasks: React.Dispatch<React.SetStateAction<RecurringTask[]>>;
}

const NewRecurringTask: React.FC<NewRecurringTaskProps> = ({ setAddingTask, accountID, setRecurringTasks }) => {
const [task, setTask] = useState("")
const [frequency, setFrequency] = useState("Daily")

const frequencies = ['Daily', 'Weekly', "Monthly"]

  const createRecurringTask = async () => {
    const url = 'http://localhost:3000/projects/add/task';
    const newRecurringTask = {
      accountID: accountID,
      task: task,
      frequency: frequency
    }
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newRecurringTask)
      });

      const responseData = await response.json()

      setRecurringTasks((tasks) => [...tasks, responseData])
      setAddingTask(false)
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='new-item-container'>
      <div className='new-item-form'>
        <div className='new-item-heading'>
          <h2>New Recurring Task</h2>
          <button
            onClick={() => {
              setAddingTask(false);
            }}
          >
            Cancel
          </button>
        </div>
        <div className='new-item-details-container'>
          <div className='new-item-details jc-cen'>
          <div className='new-item-detail-column'>
          <label className='new-item-label'>
                Recurring Task
                <input
                  className='new-item-input'
                  type='text'
                  value={task}
                  onChange={(e) => {
                    setTask(e.target.value);
                  }}
                />
              </label>
              <label className='new-item-label'>
                Frequency
                <select
                  className='new-item-input'
                  value={frequency}
                  onChange={(e) => {
                    setFrequency(e.target.value);
                  }}
                >
                  {frequencies.map((frequency, index) => (
                    <option key={index} value={frequency}>
                      {frequency}
                    </option>
                  ))}
                </select>
              </label>
              <div className='new-item-create-button'>
                <button onClick={createRecurringTask}>Create</button>
              </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default NewRecurringTask;
