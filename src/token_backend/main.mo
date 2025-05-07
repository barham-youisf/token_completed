// import Debug "mo:base/Debug";
import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";

actor Token {
  let _owner : Principal = Principal.fromText("<YOUR_PRINCIPAL_ID>");
  let _totalSupply : Nat = 2828282828;
  let _symbol : Text = "BARHAM";

  private stable var _balanceEntries : [(Principal, Nat)] = [];
  private var balances = HashMap.HashMap<Principal, Nat>(1, Principal.equal, Principal.hash);
  // balances.put(_owner, _totalSupply);
  if (balances.size() < 1) {
    balances.put(_owner, _totalSupply);
  };

  public query func getOwner() : async Principal {
    return _owner;
  };
  public query func getTotalSupply() : async Nat {
    return _totalSupply;
  };
  public query func getSymbol() : async Text {
    return _symbol;
  };

  public query func balanceOf(who : Principal) : async Nat {
    var balance = switch (balances.get(who)) {
      case (null) { 0 };
      case (?b) { b };
    };
    return balance;
  };

  public shared (msg) func payOut() : async Text {

    if (balances.get(msg.caller) == null) {
      var amaount = 8888;
      let result = await transfer(msg.caller, amaount);
      return result;
    } else {
      return "Already Clamied";
    };
  };

  public shared (msg) func transfer(to : Principal, amount : Nat) : async Text {
    let fromBalance = await balanceOf(msg.caller);
    if (fromBalance > amount) {
      let newFromBalance : Nat = fromBalance - amount;
      balances.put(msg.caller, newFromBalance);

      let toBalance = await balanceOf(to);
      let newToBalance = toBalance + amount;
      balances.put(to, newToBalance);
      return "Success";
    } else {
      return "Insufficient Balance";
    };
  };

  system func preupgrade() {
    _balanceEntries := Iter.toArray(balances.entries());

  };

  system func postupgrade() {

    balances := HashMap.fromIter<Principal, Nat>(_balanceEntries.vals(), 1, Principal.equal, Principal.hash);
    if (balances.size() < 1) {
      balances.put(_owner, _totalSupply);
    }

  };

};
