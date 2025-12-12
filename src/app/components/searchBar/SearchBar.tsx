import { alpha, styled } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search"
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setQuery } from "@/lib/slices/searchSlice";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": { backgroundColor: alpha(theme.palette.common.white, 0.25) },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: { marginLeft: theme.spacing(1), width: "auto" },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled("input")(({ theme }) => ({
  color: "inherit",
  width: "100%",
  padding: theme.spacing(1, 1, 1, 0),
  paddingLeft: `calc(1em + ${theme.spacing(4)})`,
  transition: theme.transitions.create("width"),
  [theme.breakpoints.up("sm")]: { width: "12ch", "&:focus": { width: "20ch" } },
}));

interface SearchBarProps {

}


export default function SearchBar()  {
const dispatch = useAppDispatch();
 const search = useAppSelector((state) => state.search.query);
  return (
      <Search>
            <SearchIconWrapper><SearchIcon /></SearchIconWrapper>
            <StyledInputBase placeholder="Search…" value={search}  onChange={(e) => dispatch(setQuery(e.target.value))}/>
          </Search>
  );
}