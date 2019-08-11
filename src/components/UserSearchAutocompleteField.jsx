import React, { useState, useEffect, useRef, useCallback } from "react";
import styled from "styled-components";
import { themeGet } from "@styled-system/theme-get";
import uniqBy from "lodash/uniqBy";

import { useDebounce, useUserSearch } from "../hooks";
import { Box, Text, Avatar } from "./styles";

const Input = styled.input`
  padding: ${themeGet("space.2")};
  margin: ${themeGet("space.1")} 0;
  border: none;
  border-radius: ${themeGet("radii.small")};
  outline: none;
  font-family: ${themeGet("fonts.sans")};
  font-size: ${themeGet("fontSizes.2")};
  width: calc(100% - ${themeGet("space.2")} * 2);
  background-color: transparent;
`;

const DropDown = styled.ul`
  min-width: 16rem;
  background-color: ${themeGet("colors.trueWhite")};
  border-radius: ${themeGet("radii.normal")};
  box-shadow: ${themeGet("shadows.normal")};
  padding: ${themeGet("space.2")} 0;
  visibility: ${props => (props.isOpen ? "visible" : "hidden")};
  transition: all ease ${themeGet("animations.fast")};
  transform: ${props =>
    props.isOpen ? "translateY(0rem)" : "translateY(-1rem)"};
  opacity: ${props => (props.isOpen ? "1" : "0")};
  z-index: 30;
`;

const Item = styled.button`
  padding: ${themeGet("space.2")} ${themeGet("space.3")};
  font-size: ${themeGet("fontSizes.2")};
  background: inherit;
  border: none;
  font-family: inherit;
  text-align: left;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;

  &:focus,
  &:hover {
    background-color: ${themeGet("colors.veryLightGray")};
  }
`;

function DropDownItem({ member, onClick }) {
  return (
    <li>
      <Item onClick={onClick}>
        <Avatar src={member.avatar} size="3rem" />
        <Text ml={2}>{member.fullName}</Text>
      </Item>
    </li>
  );
}

const EMAIL_REGEXP = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

/*
 * @Component UserSearchAutocompleteField
 *
 * See <MultiMemberPickerField /> for example usage
 *
 * @param {string} query
 * @param {(string) => string} onQueryChange
 * @param {any[]} results
 * @param {any[] => any[]} onResultsChange
 * @param {clickedResult => undefined} onClick
 * @param {ref} ref
 */
export default React.forwardRef(
  ({ query, results, onQueryChange, onResultsChange, onClick }, ref) => {
    const inputContainerEl = useRef(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const debouncedQuery = useDebounce(query, 200);
    const handleResultsChange = useCallback(onResultsChange);
    const { contactsResults, networkResults } = useUserSearch(debouncedQuery);

    useEffect(() => {
      if (debouncedQuery) {
        const isEmail = EMAIL_REGEXP.test(debouncedQuery);
        if (isEmail) {
          handleResultsChange([
            {
              email: debouncedQuery,
              fullName: debouncedQuery,
              id: debouncedQuery
            }
          ]);
        } else {
          handleResultsChange(
            uniqBy(contactsResults.concat(networkResults), "id")
          );
        }
        setIsDropdownOpen(true);
      }
    }, [debouncedQuery, networkResults, contactsResults, handleResultsChange]);

    useEffect(() => {
      function handleCloseDropdown(e) {
        if (!inputContainerEl.current.contains(e.target)) {
          setIsDropdownOpen(false);
        }
      }

      if (isDropdownOpen) {
        document.addEventListener("click", handleCloseDropdown);
      }

      return () => {
        document.removeEventListener("click", handleCloseDropdown);
      };
    }, [isDropdownOpen, setIsDropdownOpen, inputContainerEl]);

    return (
      <Box position="relative" ref={inputContainerEl}>
        <Input ref={ref} type="text" value={query} onChange={onQueryChange} />
        <Box position="absolute" left="0" top="100%">
          <DropDown isOpen={isDropdownOpen}>
            {results.length < 1 ? (
              <Text px={3} py={2} color="gray" fontSize={2} display="block">
                No results
              </Text>
            ) : (
              results.map(result => (
                <DropDownItem
                  key={result.id}
                  member={result}
                  onClick={e => onClick(e, result)}
                />
              ))
            )}
          </DropDown>
        </Box>
      </Box>
    );
  }
);
