import React, { Suspense, lazy, useEffect, useState }  from "react";
import { Loader } from '@mantine/core';

const importStyleCard = cardId =>
  lazy(() =>
    import(`./${cardId}`).catch(() => import(`./NullCard`))
  );


export interface StyleCardProps {
  readonly cardId: string;
}

const ActiveStyleCard : React.FC<StyleCardProps>  = ( { cardId } : StyleCardProps) => {

  const [ styleCard, setStyleCard] = useState(undefined);
  useEffect(() => {

    async function loadCard() {
      const StyleCard = await importStyleCard(cardId);
      return (
        <StyleCard />
      );
    }

    loadCard().then(setStyleCard);
  }, [cardId]);

  return (
      <Suspense fallback={
        <div className="flex flex-row items-center justify-center w-100 h-64"><Loader size={100} /></div>
      }>
        {styleCard}
      </Suspense>
  )
}

export default ActiveStyleCard;
