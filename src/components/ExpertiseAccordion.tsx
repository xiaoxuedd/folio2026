import { Accordion, AccordionItem } from '@szhsin/react-accordion';
import './ExpertiseAccordion.css';

interface ExpertiseArea {
  title: string;
  description: string;
}

interface ExpertiseAccordionProps {
  expertiseAreas: ExpertiseArea[];
}

export default function ExpertiseAccordion({ expertiseAreas }: ExpertiseAccordionProps) {
  return (
    <div className="expertise-accordion">
      <Accordion transition transitionTimeout={250}>
        {expertiseAreas.map((area, index) => (
          <AccordionItem
            key={index}
            header={area.title}
            initialEntered={index === 0}
            className="accordion-item"
            buttonProps={{
              className: ({ isEnter }) =>
                `accordion-header ${isEnter ? 'is-open' : ''}`,
            }}
            contentProps={{ className: 'accordion-content' }}
            panelProps={{ className: 'accordion-panel' }}
          >
            {area.description}
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
