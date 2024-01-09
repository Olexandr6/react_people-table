/* eslint-disable react/jsx-no-bind */
/* eslint-disable object-curly-newline, no-console */
import React, { useState } from 'react';
import classNames from 'classnames';

import '@fortawesome/fontawesome-free/css/all.css';
import 'bulma/css/bulma.css';
import './App.scss';

import peopleFromServer from './people.json';
import { SexButton } from './SexButton';
import { Button } from './components/Button';

function preparePeople(people, {
  query = '',
  sex = 'all',
  sortField = '',
  sortOrder = 'asc',
}) {
  const normalizedQuery = query.trim().toLowerCase();
  let preparedPeople = [...people];

  if (normalizedQuery) {
    preparedPeople = preparedPeople.filter(
      person => person.name.toLowerCase().includes(normalizedQuery),
    );
  }

  if (sex !== 'all') {
    preparedPeople = preparedPeople.filter(
      person => sex === person.sex,
    );
  }

  if (sortField !== '') {
    preparedPeople.sort(
      (person1, person2) => {
        if (sortField === 'born') {
          return person1.born - person2.born;
        }

        if (sortField === 'name') {
          return person1.name.localeCompare(person2.name);
        }

        if (sortField === 'sex') {
          return person1.sex.localeCompare(person2.sex);
        }

        return 0;
      },
    );
  }

  if (sortOrder === 'desc') {
    preparedPeople.reverse();
  }

  return preparedPeople;
}

const PeopleTable = ({
  people = [],
  selectedPeople = [],
  isSelected = () => false,
  addPerson = () => {},
  removePerson = () => {},
  sortField = '',
  onSort = () => {},
}) => (
  <table className="table is-striped is-narrow">
    <caption>
      {selectedPeople.map(p => p.name).join(', ') || '---'}
    </caption>
    <thead>
      <tr>
        <th> </th>
        <th>
          <a
            href="#/"
            onClick={() => onSort('name')}
            className={classNames({
              'has-text-danger': sortField === 'name',
            })}
          >
            name
          </a>
        </th>
        <th>
          <a
            href="#/"
            onClick={() => onSort('sex')}
            className={classNames({
              'has-text-danger': sortField === 'sex',
            })}
          >
            sex
          </a>
        </th>
        <th>
          <a
            href="#/"
            onClick={() => onSort('born')}
            className={classNames({
              'has-text-danger': sortField === 'born',
            })}
          >
            born
          </a>
        </th>
      </tr>
    </thead>
    <tbody>
      {people.map(person => (
        <tr
          key={person.slug}
          className={classNames({
            'has-background-warning': isSelected(person),
          })}
        >
          <td>
            {isSelected(person) ? (
              <Button
                className="is-small is-rounded is-danger"
                onClick={() => removePerson(person)}
              >
                <span className="icon is-small">
                  <i className="fas fa-minus" />
                </span>
              </Button>
            ) : (
              <Button
                className="is-small is-rounded is-success"
                onClick={() => addPerson(person)}
              >
                <span className="icon is-small">
                  <i className="fas fa-plus" />
                </span>
              </Button>
            )}
          </td>

          <td>{person.name}</td>
          <td>{person.sex}</td>
          <td>{person.born}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

export function App() {
  // #region selected
  const [selectedPeople, setSelectedPeople] = useState([]);

  function isSelected({ slug }) {
    return selectedPeople.some(p => p.slug === slug);
  }

  function addPerson(person) {
    setSelectedPeople([...selectedPeople, person]);
  }

  function removePerson(person) {
    setSelectedPeople(
      selectedPeople.filter(p => p !== person),
    );
  }
  // #endregion

  const [query, setQuery] = useState('');
  const [sex, setSex] = useState('all');
  const [sortField, setSortField] = useState('');
  const sortOrder = 'asc';

  function reset() {
    setQuery('');
    setSex('all');
    setSortField('');
  }

  const visiblePeople = preparePeople(
    peopleFromServer,
    { query, sex, sortField, sortOrder },
  );

  return (
    <div className="box">
      <div className="block">
        <div className="buttons has-addons">
          <SexButton sex="all" setSex={setSex} isSelected={sex === 'all'} />
          <SexButton sex="m" setSex={setSex} isSelected={sex === 'm'} />
          <SexButton sex="f" setSex={setSex} isSelected={sex === 'f'} />
        </div>

        <input
          type="search"
          onChange={(event) => {
            setQuery(event.target.value);
          }}
        />
      </div>

      {/* eslint-disable-next-line react/jsx-no-bind */}
      <Button onClick={reset}>Reset</Button>

      <PeopleTable
        people={visiblePeople}
        selectedPeople={selectedPeople}
        isSelected={isSelected}
        onPersonSelect={addPerson}
        onPersonUnselect={removePerson}
        sortField={sortField}
        onSort={setSortField}
      />
    </div>
  );
}
