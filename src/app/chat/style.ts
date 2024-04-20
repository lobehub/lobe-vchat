import { createStyles } from 'antd-style';

const useStyles = createStyles(({ css }) => ({
  chat: css`
    display: flex;
    flex-direction: row;
    flex-grow: 1;

    width: 100%;
    height: 100%;
  `,
  content: css`
    width: 100%;
    height: 100%;
  `,
}));

export { useStyles };
