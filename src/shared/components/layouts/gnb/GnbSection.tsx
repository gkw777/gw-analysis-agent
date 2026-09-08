import { useState, type ReactNode } from 'react';
import { Typography, Collapse } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import classNames from 'classnames';
import styles from './Gnb.module.scss';

interface GnbSectionProps {
  title: string;
  children: ReactNode;
  defaultExpanded?: boolean;
}

const GnbSection = ({ title, children, defaultExpanded = true }: GnbSectionProps) => {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <div className={styles.section}>
      <button
        type="button"
        className={styles.sectionHeader}
        onClick={() => setExpanded((prev) => !prev)}
        aria-expanded={expanded}
      >
        <Typography variant="caption" className={styles.sectionTitle} fontWeight={700} fontSize="0.85rem">
          {title}
        </Typography>
        <ExpandMoreIcon
          fontSize="small"
          className={classNames(styles.sectionChevron, expanded && styles.sectionChevronExpanded)}
        />
      </button>
      <Collapse in={expanded}>{children}</Collapse>
    </div>
  );
};

export default GnbSection;
