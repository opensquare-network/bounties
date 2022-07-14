import styled from "styled-components";
import { p_16_semibold } from "@osn/common-ui/es/styles/textStyles";
import { MarkdownPreviewer } from "@osn/previewer";
import Accordion from "components/Accordion";

const Wrapper = styled.div``;

const Title = styled.span`
  ${p_16_semibold}
`;

export default function Description({ bountyDetail }) {
  return (
    <Wrapper>
      <Accordion title={<Title>Description</Title>}>
        <MarkdownPreviewer content={bountyDetail.content} />
      </Accordion>
    </Wrapper>
  );
}
