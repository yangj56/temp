/* eslint-disable sonarjs/no-duplicate-string */
import { selectAppState } from 'features/poc/slices/user';
import { useAppSelector } from 'hooks/useSlice';
import { useState } from 'react';
import { FaFileAlt } from 'react-icons/fa';

export default function AppStateList() {
  const appStateVal = useAppSelector(selectAppState);
  const [showItems, setShowItems] = useState(false);
  const items = appStateVal.map((item) => (
    <div className="border-b-2 p-2">{item}</div>
  ));
  return (
    <div className="absolute right-3 bottom-3 flex justify-end">
      <FaFileAlt
        onClick={() => setShowItems(!showItems)}
        size={40}
        className="cursor-pointer"
      />
      {showItems && (
        <div
          className="bg-red-400"
          style={{
            overflow: 'scroll',
            height: '30rem',
            width: '40rem',
            overflowWrap: 'break-word',
          }}
        >
          {items}
        </div>
      )}
    </div>
  );
}
