pragma solidity >=0.5.0 <0.7.0;

import "@openzeppelin/contracts/token/ERC721/ERC721Full.sol";


contract Monsters is ERC721Full {
    string[] public monsters;
    uint256 public _id;
    mapping(string => bool) _monsterExists;

    constructor() public ERC721Full("Monsters", "MONSTERS") {}

    function mint(string memory _monsters) public {
        require(!_monsterExists[_monsters], "Should not be minted before");
        _id++;
        monsters.push(_monsters);
        _mint(msg.sender, _id);
        _monsterExists[_monsters] = true;
    }
}
