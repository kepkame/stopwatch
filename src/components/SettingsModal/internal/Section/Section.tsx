import clsx from 'clsx';
import type { SectionProps } from './Section.types';
import styles from './Section.module.scss';

export const Section: React.FC<SectionProps> = ({
  title,
  description,
  control,
  children,
}) => {
  return (
    <section className={styles.section}>
      <header
        className={clsx(styles.header, control && styles.headerWithControl)}
      >
        <h3 className={styles.title}>{title}</h3>
        {control && <div className={styles.control}>{control}</div>}
      </header>

      {description && <p className={styles.description}>{description}</p>}

      {children && <div className={styles.content}>{children}</div>}
    </section>
  );
};
