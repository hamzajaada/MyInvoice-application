const { Box } = require("@mui/material");
const { styled } = require("@mui/system");
// styled mui component resumes the style flex and between
const FlexBetween = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
});

export default FlexBetween;